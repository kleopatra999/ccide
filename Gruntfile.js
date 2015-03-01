module.exports = function(grunt) {
    grunt.loadNpmTasks("grunt-ts");
    grunt.loadNpmTasks('grunt-contrib-clean');
    grunt.loadNpmTasks('grunt-contrib-copy');
    grunt.loadNpmTasks('grunt-import');
    grunt.loadNpmTasks('grunt-contrib-watch');

    // Project configuration.
    grunt.initConfig({
        pkg: grunt.file.readJSON('package.json'),
        clean: {
            build: ["./build"],
            dist: ["./dist"],
            options: {
                interrupt: true
            }
        },
        watch: {
            typeScripts: {
                files: 'src/**/*.ts',
                tasks: ['default']
            }
        },
        ts: {
            buildClient: {
                src: ["./src/Client/*.ts", "./src/Client/**/*.ts", "./src/Common/**/*.ts", "./src/lib.d/**/*.ts"],
                reference: "./build/client_sources.ts",
                outDir: './build',
                //watch: "core",

                options: {
                    // 'es3' (default) | 'es5'
                    target: 'es5',
                    // 'amd' (default) | 'commonjs'
                    module: 'commonjs',
                    // true (default) | false
                    sourceMap: true,
                    // true | false (default)
                    declaration: true,
                    // true (default) | false
                    removeComments: true
                }
            },
            buildServer: {
                src: ["./src/Server/**/*.ts", "./src/Common/**/*.ts", "./src/lib.d/**/*.ts", "./src/ccide.ts"],
                reference: "./build/server_sources.ts",
                outDir: './build',
                //watch: "core",

                options: {
                    // 'es3' (default) | 'es5'
                    target: 'es5',
                    // 'amd' (default) | 'commonjs'
                    module: 'commonjs',
                    // true (default) | false
                    sourceMap: true,
                    // true | false (default)
                    declaration: true,
                    // true (default) | false
                    removeComments: true
                }
            }
        },
        copy: {
            buildServer: {
                src: './build/server_sources.ts',
                dest: './build/server_sources.inc',
                options: {
                    process: function (content, srcPath) {
                        return content.replace(/\/\/\/ <reference path="\.\.\/src\/(.*).ts" \/>/g, "@import \"../build/$1.js\";")
                            .replace(/(@import \".*\.d\.js\";)/g, "");

                    }
                }
            },
            buildClient: {
                src: './build/client_sources.ts',
                dest: './build/client_sources.inc',
                options: {
                    process: function (content, srcPath) {
                        return content.replace(/\/\/\/ <reference path="\.\.\/src\/(.*).ts" \/>/g, "@import \"../build/$1.js\";")
                            .replace(/(@import \".*\.d\.js\";)/g, "");

                    }
                }
            },
            publicFiles: {
                files: [
                    {expand: true, cwd: './src/public/', src: ['**'], dest: './build/public/'}
                ]
            }
        },
        import: {
            options: {
                banner: '\n\n/*! <%= pkg.name %> - v<%= pkg.version %> - <%= grunt.template.today("yyyy-mm-dd") %> */\n\n',
                footer: '\n\n/*! <%= pkg.name %> - v<%= pkg.version %> - <%= grunt.template.today("yyyy-mm-dd") %> */\n\n',
                separator: ''
            },
            buildClient: {
                src: './build/client_sources.inc',
                dest: './build/public/ccide_client.js'
            },
            buildServer: {
                src: './build/server_sources.inc',
                dest: './build/ccide_server.js'
            }
        }
    });


    grunt.registerTask('default', ['clean:build', 'ts:buildClient', 'ts:buildServer', 'copy:buildServer', 'copy:buildClient', 'import:buildClient', 'import:buildServer', 'copy:publicFiles']);
    grunt.registerTask('dev', ['default','watch:typeScripts']);

};