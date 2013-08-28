require.config({
    baseUrl: 'js',
    paths: {
        // library: 'vendor/library/library.js',
    }
});

require(['status'], function(main) {
    main.load();
});
