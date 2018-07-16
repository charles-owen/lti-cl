<?php
/**
 * @file
 * Site.start options documentation
 */

/**
 * @page start-options Site.start options
 * @tableofcontents
 *
 * @section lti-components LTI components
 *
 * @subsection lti lti => group
 *
 * When placed on a page that is an LTI target, the lti option specifies a group
 * name for pages that can be accessed via that LTI invocation. Access to any page
 * that includes this option is prohibited if the group name does not match what is
 * indicated on the LTI target page. Attempts to access this page without an LTI
 * invocation are also blocked.
 *
 * The main purpose for this feature is to indicate pages that are allowed for a
 * given LTI invocation. For example, if there are two quizzes, quiz-a and quiz-b,
 * setting the group of the first like this: ['lti'->'quiz-a'] will prevent a user
 * from browsing to quiz-b while taking quiz-a. It will allow prevent a user from
 * browsing to the quiz page unless they have been directed to the page by the learning
 * management system.
 *
 * \code
 * $view = new CL\Site\View($site, ['lti'=>'second');
 * \endcode
 *
 * @subsection lti-assign-tag assign-tag
 *
 * The assign-tag option specifies an assignment name for an LTI invocation. If the page
 * is associated with an assignment, the assign-tag option is used to specify the assignment.
 * Tags are short key strings used to specify an assignment or parts of an assignment. An
 * example might be 'assign1' or 'step1'. Grade submission for an LTI page, either in the
 * system or automatically by the user is only possible if an assignment is specified.
 *
 * \code
 * $view = new CL\Site\View($site, ['lti'=>'second', 'assign-tag'=>'assignment1']);
 * \endcode
 *
 * @subsection lti-grade-tag grade-tag
 *
 * Since some assignments may have multiple graded elements, an additional grade-tag can be specified
 * in addition to the assignment tag. For example if 'assignment1' has two quizzes, 'quiz1' and 'quiz2',
 * the assign-tag value will be 'assignment1' and the two quizzes will have grade-tag values of
 * 'quiz1' and 'quiz1' respectively.
 *
 * @subsection lti-grade-token grade-token
 *
 * It is possible for a page to automatically grade itself and submit the grade to the learning management
 * system as an API call from JavaScript. In such a case, the grade-token option is used to specify a
 * token (secret) that must be send with the
 * grade. This is a security measure to make it more difficult for a student to manually invoke the API
 * option to submit the grade.
 *
 * Note that this is only a limited degree of security. There is no way to prevent a user from examining
 * code or the data sent to the server to determine the token. However, it does make it more difficult for the
 * typical student. In addition the system allows audit information to be sent with the grade submission
 * so that security audits can be later performed.
 *
 * These issue only impact grades originated by JavaScript API calls. Server-side PHP is secure and does not
 * use grade-token.
 */