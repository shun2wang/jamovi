
'use strict';

const _ = require('underscore');
const $ = require('jquery');
const Backbone = require('backbone');
Backbone.$ = $;

const keyboardJS = require('keyboardjs');

const DataVarWidget = require('./datavarwidget');
const ComputedVarWidget = require('./computedvarwidget');

const EditorWidget = Backbone.View.extend({
    className: 'EditorWidget',
    initialize(args) {

        this.attached = true;

        this.$el.empty();
        this.$el.addClass('silky-variable-editor-widget');

        this.$title = $('<input class="silky-variable-editor-widget-title" type="text" maxlength="63">').appendTo(this.$el);
        this._currentKeyboardContext = '';
        this.$title.focus(() => {
            this._currentKeyboardContext = keyboardJS.getContext();
            keyboardJS.setContext('');
            this.$title.select();
        } );
        this.$title.on('change keyup paste', () => {
            let newName = this.$title.val().trim();
            this.model.set({ name: newName });
        } );
        this.$title.blur(() => {
            keyboardJS.setContext(this._currentKeyboardContext);
        } );

        this.$title.keydown((event) => {
            var keypressed = event.keyCode || event.which;
            if (keypressed === 13) { // enter key
                this.$title.blur();
                if (this.model.get('changes'))
                    this.model.apply();
                event.preventDefault();
                event.stopPropagation();
            }
            else if (keypressed === 27) { // escape key
                this.$title.blur();
                if (this.model.get('changes'))
                    this.model.revert();
                event.preventDefault();
                event.stopPropagation();
            }
        });

        this.$body = $('<div class="silky-variable-editor-widget-body"></div>').appendTo(this.$el);

        this.$dataVarWidget = $('<div></div>').appendTo(this.$body);
        this.dataVarWidget = new DataVarWidget({ el: this.$dataVarWidget, model: this.model });

        this.$computedVarWidget = $('<div></div>').appendTo(this.$body);
        this.computedVarWidget = new ComputedVarWidget({ el: this.$computedVarWidget, model: this.model });
    },
    detach() {
        this.model.apply();
        this.attached = false;

        this.dataVarWidget.detach();
        this.computedVarWidget.detach();
    },
    attach() {
        this.attached = true;
        let name = this.model.get('name');
        if (name !== this.$title.val())
            this.$title.val(name);

        let type = this.model.get('columnType');
        if (type !== 'computed') {
            this.dataVarWidget.attach();
            this.$dataVarWidget.show();
            this.$computedVarWidget.hide();
        }
        else {
            this.computedVarWidget.attach();
            this.$computedVarWidget.show();
            this.$dataVarWidget.hide();
        }
    }
});

module.exports = EditorWidget;
