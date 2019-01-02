
import LtiComponent from './LtiComponent.vue';

const User = Site.User;

/**
 * Install LTI console components
 * @constructor
 */
export const LtiConsole = function (site) {
    const Console = site.console;

    Console.tables.add({
        title: 'LTI',
        order: 90,
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
