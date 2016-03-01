/**
 * Created by Gabriel_Grinberg on 6/13/14.
 * Modified by Mac-I crowell on 3/1/16 for textarea and fixing 2 way binding
 */


(function() {
	'use strict';
	angular.module('gg.editableTextTextarea', []);


})();

(function() {
	'use strict';
	angular.module('gg.editableTextTextarea')
		.directive('editableTextTextarea', ['editableTextTextareaHelper', function(editableTextTextareaHelper) {
			return {
				scope: {
					editableTextTextarea: '=',
					editMode: '=',
					placeholder: '@',
					onChange: '&'
				},
				transclude: true,
				template: '<span ng-class="{\'is-placeholder\': placeholder && !editingValue}">' +
					'<textarea style="overflow:auto;resize:none" ng-show="isEditing" ng-keypress="($event.which === 13) && (isEditing = false)" ng-model="editableTextTextarea" placeholder="{{placeholder}}"></textarea>' +
					'<span ng-hide="isEditing || isWorking" class="original-text" tabindex="0">{{placeholder ? (editingValue ? editingValue : placeholder) : editingValue}}</span>' +
					'<span ng-hide="isEditing" ng-transclude></span>' +
					'<span ng-show="isWorking" class="' + editableTextTextareaHelper.workingClassName + '">' + editableTextTextareaHelper.workingText + '</span>' +
					'</span>',
				link: function(scope, elem, attrs) {
					var input = elem.find('textarea'),
						lastValue;

					scope.isEditing = !!scope.editMode;

					scope.editingValue = scope.editableTextTextarea;

					elem.addClass('gg-editable-text');

					scope.$watch('isEditing', function(val, oldVal) {
						var editPromise, inputElm = input[0];

						if (attrs.editMode !== undefined) {
							scope.editMode = val;
						}
						elem[val ? 'addClass' : 'removeClass']('editing');
						if (val) {
							inputElm.focus();
							inputElm.selectionStart = inputElm.selectionEnd = scope.editingValue ? scope.editingValue.length : 0;
							setTimeout(function() {inputElm.style.height = Math.max(inputElm.scrollHeight, 300) + "px";},1);
							//fix for FF
						} else {
							if (attrs.onChange && val !== oldVal && scope.editingValue != lastValue) {
								//accept promise, or plain function..
								editPromise = scope.onChange({ value: scope.editingValue });
								if (editPromise && editPromise.then) {
									scope.isWorking = true;
									editPromise.then(function(value) {
										scope.editableTextTextarea = scope.editingValue = value;
										scope.isWorking = false;
									}, function() {
										scope.editingValue = scope.editableTextTextarea;
										scope.isWorking = false;
									});
								} else if (editPromise) scope.editableTextTextarea = scope.editingValue = editPromise;
								else scope.editingValue = scope.editableTextTextarea;
							} else scope.editableTextTextarea = scope.editingValue;
						}
					});

					scope.$watch('editMode', function(val) {
						scope.isEditing = !!val;
					});

					scope.$watch('editableTextTextarea', function(newVal) {
						input[0].style.height = Math.max(input[0].scrollHeight, 300) + "px";
						lastValue = newVal;
						scope.editingValue = newVal;
					});
				}
			}
		}]);
})();

'use strict';
(function() {
	angular.module('gg.editableTextTextarea')
		.provider('editableTextTextareaHelper', function() {

			var workingText = 'Working..',
				workingClassName = '';

			this.setWorkingText = function(text) {
				workingText = text;
				return this;
			};

			this.setWorkingClassName = function(name) {
				workingClassName = name;
				return this;
			};

			this.$get = function() {
				return {
					workingText: workingText,
					workingClassName: workingClassName
				}
			};

		});
})();
