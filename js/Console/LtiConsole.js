/**
 * @file
 * LTI console components
 */

import LtiComponent from './LtiComponent.vue';

let LtiConsole = function () {

}

Console.tables.add({
    title: 'LTI',
    order: 20,
    api: '/api/lti/tables'
});

Console.components.addOption({
    atLeast: Users.User.STAFF,
    page: {title: 'Main', route: '', order: 1},
    section: {title: 'Lti', order: 20},
    title: 'LTI Submissions',
    order: 1,
    route: '/lti',
    routes: [
        {route: '/lti', component: LtiComponent}
    ]
});

export default LtiConsole;

