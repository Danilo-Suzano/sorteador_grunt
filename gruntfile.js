module.exports =function(grunt){ //inicializar o grunt
    grunt.initConfig({
        pkg: grunt.file.readJSON("package.json"),
        less: { //compilando o less (desenvolvimento)
            development:{
                files: {
                    'dev/styles/main.css': 'src/styles/main.less' //executando less o primeiro é o arquivo de destino e o segundo de origem 

                }
            },
            production:{ //comprimindo o less (execução)
                options: {
                    compress: true,
                },
                files:{
                    'dist/styles/main.min.css' : 'src/styles/main.less' //primeiro é o arquivo de destino e o segundo de origem
                }
            }
        },
        watch:{ //para verificar e fazer as atualizações automaticamente
            less:{
                files:['src/styles/**/*.less'], 
                tasks:['less:development']
            },
            html:{
                files:['src/index.html'],
                tasks:['replace:dev']
            }
        },
        replace:{ //fazer o replace no html para pasta de dev 
            dev:{
                options:{
                    patterns: [
                        {
                            match: 'ENDERECO_DO_CSS',
                            replacement: './styles/main.css'
                        },
                        {
                            match: 'ENDERECO_DO_JS',
                            replacement: '../src/scripts/main.js'
                        }
                    ]
                },
                files:[
                    {
                        expand: true,
                        flatten: true,
                        src: ['src/index.html'],
                        dest: 'dev/'
                    }
                ]
            },
            dist:{
                options:{
                    patterns: [
                        {
                            match: 'ENDERECO_DO_CSS',
                            replacement: './styles/main.min.css'
                        },
                        {
                            match: 'ENDERECO_DO_JS',
                            replacement: './scripts/main.min.js'
                        }
                    ]
                },
                files:[
                    {
                        expand: true,
                        flatten: true,
                        src: ['prebuild/index.html'],
                        dest: 'dist/'
                    }
                ]
            }
        },
        htmlmin: { // fazer a minficação do arquivo html 
            dist: {
                options: {
                    removeComments: true,
                    collapseWhitespace: true
                },
                files: {
                    'prebuild/index.html': 'src/index.html'
                }
            }
        },
        clean:['prebuild'], // limpar a pasta criada no inicio
        uglify:{ //minificando o JS 
            target:{
                files: {
                    'dist/scripts/main.min.js': ['src/scripts/main.js']
                }
            }
        } 
})


//carregamentos dos plugins
    grunt.loadNpmTasks('grunt-contrib-less');
    grunt.loadNpmTasks('grunt-contrib-watch');
    grunt.loadNpmTasks('grunt-replace');
    grunt.loadNpmTasks('grunt-contrib-htmlmin');
    grunt.loadNpmTasks('grunt-contrib-clean');
    grunt.loadNpmTasks('grunt-contrib-uglify');

//registrando as tarefas
    grunt.registerTask('default',['watch']); 
    grunt.registerTask('build',['less:production', 'htmlmin:dist', 'replace:dist', 'clean', 'uglify']);
}