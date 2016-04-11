/*
The main angular file, it controls everything 
*/

// Great documentation and structure. Please consider using a subdirectory views in public that acts as a means of rending your
// ng-view under your np-app in your index.html - That way you are breaking down your index.html instead of it being a huge
// html file.

var myApp = angular.module('angular-wiki-article', ['ngRoute', 'ngMaterial', 'gg.editableText', 'gg.editableTextTextarea'])
	.controller('ArticleController', ['ArticleService', '$scope', '$mdSidenav', '$routeParams', '$location', ArticleController])

/*
Uses $routeProvider to inject the appropriate template url and set the appropriate controllwer. 
*/

// Thank youu I was looking for someone to use routeProvider
myApp.config(
	function($routeProvider, $locationProvider) {
		$routeProvider.
		when('/article/:articleId', {
			templateUrl: '/html/article.html',
			controller: 'ArticleController as ul'
		}).
		otherwise({
			templateUrl: '/html/article.html',
			controller: 'ArticleController as ul'
		});
		$locationProvider.html5Mode({ enabled: true, requireBase: false });
	});

/*
Taken from: http://joelsaupe.com/programming/angularjs-change-path-without-reloading/
This allows $location.path to take an extra arguemnt preventing automtic page reloading
*/
myApp.run(['$route', '$rootScope', '$location', function ($route, $rootScope, $location) {
    var original = $location.path;
    $location.path = function (path, reload) {
        if (reload === false) {
            var lastRoute = $route.current;
            var un = $rootScope.$on('$locationChangeSuccess', function () {
                $route.current = lastRoute;
                un();
            });
        }
        return original.apply($location, [path]);
    };
}])


myApp.service('ArticleService', function($http) {
	/*
 	This function loads all the articles
	*/
	this.loadAllArticles = function(callback) {
		return $http.get('/api/articles').success(callback);
	};

	/*
 	This function takes in an article and tells the server to update it
	*/
	this.editArticle = function(article, callback) {
		$http.post('/api/article/edit', article)
			.success(function(data) {
				console.log("article save successfull");
				console.log(data);
				callback(data);
			})
			.error(function(data) {
				console.log('Error: ' + data);
			});
	};

	/*
 	This function takes in an article and tells the server to create it
	*/
	this.createArticle = function(article, callback) {
		$http.post('/api/article/new', article)
			.success(function(data) {
				console.log("article create successfull");
				console.log(data);
				callback(data);
			})
			.error(function(data) {
				console.log('Error: ' + data);
			});
	};

});

// Articles Controller for the Angular Material Start

function ArticleController(ArticleService, $scope, $mdSidenav, $routeParams, $location) {
	var self = this;

	console.log("loading ArticleController")
	console.log($routeParams.articleId)

	self.currentArticleId = $routeParams.articleId
	self.selected = null;
	self.articles = [];
	self.selectArticle = selectArticle;
	self.toggleList = toggleArticlesList;

	// Load all registered Articles
	ArticleService.loadAllArticles(function(articles) {
		self.articles = articles

		for (var i = 0, foundArticle = false; i < self.articles.length; ++i) {
			if (self.articles[i]._id != self.currentArticleId)
				continue;
			articles.move(i, 0)
			foundArticle = true
			break;
		}
		self.selected = articles[0];
		if (!foundArticle) {
			console.log("Invalid Article")
		}
	})

	//save the article currently being edited
	$scope.saveCurrentArticle = function() {
		console.log("saving article")
		//check if article already existed on server or is a new article
		if (self.selected._id) {
			ArticleService.editArticle(self.selected, function(data) {
				console.log("article saved")
			})
		} else {
			ArticleService.createArticle(self.selected, function(data) {
				console.log("article created")
				self.articles.unshift(data);
				self.selected = self.articles[0];
				$location.path('/article/' + self.selected._id, false);
			})
		}
	}
	//Empty fields for new articel and set selected to a new object
	$scope.newArticle = function() {
		console.log("new article")
		self.selected = { title: "", introText: "" }
		$location.path('/',false);
	}



	// *********************************
	// Internal methods
	// *********************************

	/**
	 * Hide or Show the 'left' sideNav area
	 */
	function toggleArticlesList() {
		$mdSidenav('left').toggle();
		console.log(self.articles)
	}


	/**
	 * Select the current avatars
	 * @param menuId
	 */
	function selectArticle(article) {
		console.log('selectArticle')
		self.selected = article;
		self.currentArticleId = self.selected._id;
		$location.path('/article/' + self.selected._id, false);
		$scope.editModeEdit=false
	}

}

/*
Taken from: http://stackoverflow.com/a/5306832
*/
Array.prototype.move = function(old_index, new_index) {
	while (old_index < 0) {
		old_index += this.length;
	}
	while (new_index < 0) {
		new_index += this.length;
	}
	if (new_index >= this.length) {
		var k = new_index - this.length;
		while ((k--) + 1) {
			this.push(undefined);
		}
	}
	this.splice(new_index, 0, this.splice(old_index, 1)[0]);
	return this; // for testing purposes
};
