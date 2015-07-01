/*
 * Copyright (C) eZ Systems AS. All rights reserved.
 * For full copyright and license information view LICENSE file distributed with this source code.
 */
YUI.add('ez-updatetreeplugin-tests', function (Y) {
    var registerTest, eventTest,
        Mock = Y.Mock;

    eventTest = new Y.Test.Case({
        name: 'eZ Tree update events tests',

        setUp: function () {
            var App;

            this.discoveryBarInstanceMock = new Mock();
            this.treeActionViewMock = new Mock();
            this.treeMock = new Mock();
            Y.Mock.expect(this.treeMock, {
                method: 'clear',
                callCount: 1,
            });
            Y.Mock.expect(this.treeActionViewMock, {
                method: 'get',
                args: ['tree'],
                returns: this.treeMock
            });
            Y.Mock.expect(this.discoveryBarInstanceMock, {
                method: 'getAction',
                args: ['tree'],
                returns: this.treeActionViewMock
            });

            App = Y.Base.create('testApp', Y.Base, [], {
                sideViews: {
                    discoveryBar: {
                        instance : this.discoveryBarInstanceMock
                    },
                }
            }, {});

            this.app = new App();
            this.plugin = new Y.eZ.Plugin.UpdateTree({
                host: this.app,
            });
        },

        tearDown: function () {
            this.plugin.destroy();
            delete this.plugin;
            this.app.destroy();
            delete this.app;
        },

        _clearTreeOnEvent: function (eventName) {
            this.plugin.get('host').fire(eventName);
            Y.Mock.verify(this.treeMock);
        },
        _doNotClearTreeOnEvent: function (eventName) {
            Y.Mock.expect(this.treeActionViewMock, {
                method: 'get',
                args: ['tree'],
                returns: null
            });
            Y.Mock.expect(this.treeMock, {
                method: 'clear',
                callCount: 0,
            });
            this.plugin.get('host').fire(eventName);
            Y.Mock.verify(this.treeMock);
        },

        "Should clear tree when catching the sendToTrash event if tree has been loaded": function () {
            this._clearTreeOnEvent('whatever:sentToTrash');
        },

        "Should clear tree when catching the copyContent event if tree has been loaded": function () {
            this._clearTreeOnEvent('whatever:copiedContent');
        },

        "Should clear tree when catching the moveContent event if tree has been loaded": function () {
            this._clearTreeOnEvent('whatever:movedContent');
        },

        "Should clear tree when catching the publishDraft event if tree has been loaded": function () {
            this._clearTreeOnEvent('whatever:publishedDraft');
        },

        "Should clear tree when catching the saveDraft event if tree has been loaded": function () {
            this._clearTreeOnEvent('whatever:savedDraft');
        },

        "Should NOT clear tree when catching the sendToTrash event if tree has NOT been loaded": function () {
            this._doNotClearTreeOnEvent('whatever:sentToTrash');
        },

        "Should NOT clear tree when catching the copyContent event if tree has NOT been loaded": function () {
            this._doNotClearTreeOnEvent('whatever:copiedContent');
        },

        "Should NOT clear tree when catching the moveContent event if tree has NOT been loaded": function () {
            this._doNotClearTreeOnEvent('whatever:movedContent');
        },

        "Should NOT clear tree when catching the publishDraft event if tree has NOT been loaded": function () {
            this._doNotClearTreeOnEvent('whatever:publishedDraft');
        },

        "Should NOT clear tree when catching the saveDraft event if tree has NOT been loaded": function () {
            this._doNotClearTreeOnEvent('whatever:savedDraft');
        },
    });

    registerTest = new Y.Test.Case(Y.eZ.Test.PluginRegisterTest);
    registerTest.Plugin = Y.eZ.Plugin.UpdateTree;
    registerTest.components = ['platformuiApp'];

    Y.Test.Runner.setName("eZ Tree Update Plugin tests");
    Y.Test.Runner.add(eventTest);
    Y.Test.Runner.add(registerTest);
}, '', {requires: ['test', 'base', 'ez-updatetreeplugin', 'ez-pluginregister-tests']});