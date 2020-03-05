const { watch } = require('gulp');
const killProcess = require('tree-kill');
const rollup = require('rollup');

const svelte = require('rollup-plugin-svelte');
const resolve = require('@rollup/plugin-node-resolve');
const commonjs = require('@rollup/plugin-commonjs');
const livereload = require('rollup-plugin-livereload');
const { terser } = require('rollup-plugin-terser');
const { routify } = require('@sveltech/routify');

let server;

async function buildServer(production) {
    if (!production) {
        if (server) killProcess(server.pid);
        server = require('child_process').spawn('npm', ['run', 'start'], {
            stdio: ['ignore', 'inherit', 'inherit'],
            shell: true
        });
    }
}

async function buildAssets(production) {
    return rollup.rollup({
        input: 'src/main.js',
        plugins: [

            routify({
                buildSingle: production
            }),

            svelte({
                // enable run-time checks when not in production
                dev: !production,
                // we'll extract any component CSS out into
                // a separate file — better for performance
                css: css => {
                    css.write('public/build/bundle.css');
                }
            }),
    
            // If you have external dependencies installed from
            // npm, you'll most likely need these plugins. In
            // some cases you'll need additional configuration —
            // consult the documentation for details:
            // https://github.com/rollup/plugins/tree/master/packages/commonjs
            resolve({
                browser: true,
                dedupe: importee => importee === 'svelte' || importee.startsWith('svelte/')
            }),
            commonjs(),
    
            // Watch the `public` directory and refresh the
            // browser on changes when not in production
            (!production && !server) && livereload('public'),
    
            // If we're building for production (npm run build
            // instead of npm run dev), minify
            production && terser()
        ],
        watch: {
            clearScreen: false
        }
    })
        .then(bundler => {
            return bundler.write({
                sourcemap: true,
                format: 'iife',
                name: 'app',
                file: 'public/build/bundle.js'
            })
        })
}

async function build(production) {

    buildAssets(production);
    buildServer(production);

    if (!production) {
        watch(['src/**/*.svelte'], () => buildAssets(production));
        watch(['src/**/*.ts'], () => buildServer(production));
    }
    
}

exports.build = () => build(false);
exports.dev = () => build(false);
exports.prod = () => build(true);
exports.default = () => build(false);