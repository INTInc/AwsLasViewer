export default {
    props: {
        icon: {type: String, default: ''},
        title: {type: String, default: ''},
        disabled: {type: Boolean, default: false},
        active: {type: Boolean, default: false}
    },
    computed: {
        isIconButton: function () {
            return this.icon !== '';
        },
        inputListeners: function () {
            return Object.assign({}, this.$listeners);
        },
        buttonCssClass: function () {
            return this.active ? 'int-active-button' : '';
        }
    }
};
