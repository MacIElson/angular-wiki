var myApp = angular.module('angular-wiki-article', ['ngRoute', 'ngMaterial', 'gg.editableText', 'gg.editableTextTextarea'])
	.controller('ArticleController', ['ArticleService', '$scope', '$mdSidenav', '$routeParams', '$location', ArticleController])

myApp.config(
	function($routeProvider, $locationProvider) {
		$routeProvider.
		when('/article/:articleId', {
			templateUrl: '/html/article.html',
			controller: 'ArticleController as ul'
		}).
		otherwise({
			templateUrl: '/html/invalidArticle.html',
		});
		$locationProvider.html5Mode({ enabled: true, requireBase: false });
	});

myApp.service('ArticleService', function($http) {
	this.loadAllArticles = function(callback) {
		return $http.get('/api/articles').success(callback);
	};

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

	this.loadArticleTitles = function() {
		return [];
	};
	this.loadArticle = function(articleId) {
		return [];
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
		console.log(articles)
		self.articles = articles

		for (var i = 0, foundArticle = false; i < self.articles.length; ++i) {
			console.log(self.articles[i]._id);
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

	$scope.saveCurrentArticle = function() {
		console.log("saving article")
		console.log(self.selected._id)
		if (self.selected._id) {
			ArticleService.editArticle(self.selected, function(data) {
				console.log("article saved")
			})
		} else {
			ArticleService.createArticle(self.selected, function(data) {
				console.log("article created")
				self.articles.unshift(data);
				self.selected = self.articles[0];
				$location.url('/article/' + self.selected._id);
			})
		}
	}

	$scope.newArticle = function() {
		console.log("new article")
		self.selected = { title: "", introText: "" }
		$location.url('/');
	}



	// *********************************
	// Internal methods
	// *********************************

	/**
	 * Hide or Show the 'left' sideNav area
	 */
	function toggleArticlesList() {
		$mdSidenav('left').toggle();
		console.log(self.Articles)
	}


	/**
	 * Select the current avatars
	 * @param menuId
	 */
	function selectArticle(article) {
		self.selected = article;
		$location.url('/article/' + self.selected._id);
	}

}

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

function auto_grow(element) {
	console.log("autogrow")
	element.style.height = "5px";
	element.style.height = (element.scrollHeight) + "px";
}
