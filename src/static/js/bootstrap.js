require.config({
    paths: {
        // library: 'static/components/library/library.js',
    }
});

require(['status'], function(main) {
    main.load();
});
