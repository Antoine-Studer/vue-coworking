/*  ___ _            _ _    _ _
 * / __(_)_ __  _ __| (_)__(_) |_ ___
 * \__ \ | '  \| '_ \ | / _| |  _/ -_)
 * |___/_|_|_|_| .__/_|_\__|_|\__\___|
 *             |_|
 * This example is using the Simplicite node.js & browser JavaScript API
 */
import { createApp } from 'vue';
import Cow from './Cow.vue';
import simplicite from 'simplicite';

// Explicit URL needed for a standalone deployment, set it to undefined when deploying in Simplicité
const cfg = { url: 'https://ressources.demo.simplicite.io', debug: false };
const app = simplicite.session(cfg);

app.info('Version: ' + simplicite.constants.MODULE_VERSION);
app.debug(app.parameters);

app.login({ username: 'userVue', password: 'userVue0' }).then(user => {
    app.debug('Logged in as ' + user.login);

    const vueApp = createApp(Cow);

    // Make the configuration and session variable available to all components
    vueApp.config.globalProperties.$configuration = cfg;
    vueApp.config.globalProperties.$simplicite = app;

    vueApp.mount('body');
})