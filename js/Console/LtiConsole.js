/**
 * @file
 * LTI console components
 */

import {User} from 'users-cl/js/Users/User';
import LtiComponent from './LtiComponent.vue';

export const LtiConsole = function (site) {
    const Console = site.console;

    Console.tables.add({
        title: 'LTI',
        order: 20,
        api: '/api/lti/tables'
    });

    Console.components.addOption({
        atLeast: {tag: 'lti-view-submissions', default: User.STAFF},
        page: {title: 'Main', route: '', order: 1},
        section: {title: 'Lti', order: 20},
        title: 'LTI Submissions',
        order: 1,
        route: '/lti',
        routes: [
            {route: '/lti', component: LtiComponent}
        ]
    });

}
