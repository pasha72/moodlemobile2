// (C) Copyright 2015 Martin Dougiamas
//
// Licensed under the Apache License, Version 2.0 (the "License");
// you may not use this file except in compliance with the License.
// You may obtain a copy of the License at
//
//     http://www.apache.org/licenses/LICENSE-2.0
//
// Unless required by applicable law or agreed to in writing, software
// distributed under the License is distributed on an "AS IS" BASIS,
// WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
// See the License for the specific language governing permissions and
// limitations under the License.

angular.module('mm.addons.mod_quiz')

/**
 * Directive to render a multianswer (cloze) question.
 *
 * @module mm.addons.mod_quiz
 * @ngdoc directive
 * @name mmaModQuizQuestionMultianswer
 */
.directive('mmaModQuizQuestionMultianswer', function($log, $mmaModQuestionHelper, $mmUtil) {
	$log = $log.getInstance('mmaModQuizQuestionMultianswer');

    return {
        restrict: 'A',
        priority: 100,
        templateUrl: 'addons/mod_quiz/questions/multianswer/template.html',
        link: function(scope) {
            var question = scope.question,
                questionEl,
                content,
                inputs;

            if (!question) {
                $log.warn('Aborting quiz because of no question received.');
                return $mmaModQuestionHelper.showDirectiveError(scope);
            }

            questionEl = angular.element(question.html);

            // Get question content.
            content = questionEl[0].querySelector('.formulation');
            if (!content) {
                log.warn('Aborting quiz because of an error parsing question.', question.name);
                return $mmaModQuestionHelper.showDirectiveError(scope);
            }

            // Remove sequencecheck.
            $mmUtil.removeElement(content, 'input[name*=sequencecheck]');
            $mmUtil.removeElement(content, '.validationerror');

            // Find inputs of type text, radio and select and add ng-model to them.
            inputs = content.querySelectorAll('input[type="text"],input[type="radio"],select');
            angular.forEach(inputs, function(input) {
                input.setAttribute('ng-model', 'answers["' + input.name + '"]');

                if ((input.type == 'text' && input.value) || (input.type == 'radio' && input.checked)) {
                    // Store the value in the model.
                    scope.answers[input.name] = input.value;
                } else if (input.tagName.toLowerCase() == 'select') {
                    // Search if there's any option selected.
                    var selected = input.querySelector('option[selected]');
                    if (selected && selected.value !== '' && typeof selected.value != 'undefined') {
                        // Store the value in the model.
                        scope.answers[input.name] = selected.value;
                    }
                }
            });

            // Set the question text.
            question.text = content.innerHTML;
        }
    };
});
