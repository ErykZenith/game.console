const app = Vue.createApp({
    data() {
        return {
            show: true,
            isFocus: false,
            isHidden: true,
            messages: [],
            history: [],
            historyIndex: null,
            templates: [],
            hideTimeout: null
        };
    },
    methods: {
        refocus() {
            this.$nextTick(() => {
                this.$refs.input.focus()
            })
        },
        parseTemplate(item) {
            if (this.templates[item.template]) {
                return { innerHTML: this.templates[item.template](item) };
            }
            return { innerHTML: `<p>${item.msg}</p>` };
        },
        addMessage(data) {
            this.isHidden = false
            this.messages.push(data)
            this.hideConsole()
        },
        enabled(state) {
            this.show = state
        },
        showConsole() {
            this.isHidden = false
            this.isFocus = true
            clearTimeout(this.hideTimeout)
            this.$refs.input?.focus()
            window.addEventListener('keydown', this.handleKeyPress)
        },
        handleKeyPress({ key }) {
            if (key === 'Escape') {
                this.closeConsole()
            }
        },
        onListener({ data: { action, data } }) {
            switch (action) {
                case "addMessage":
                    this.addMessage(data);
                    break;
                case "open":
                    this.showConsole();
                    break;
                case "enabled":
                    this.enabled(data);
                    break;
                default:
                    break;
            }
        },
        hideConsole() {
            if(this.isFocus) return
            clearTimeout(this.hideTimeout)
            this.hideTimeout = setTimeout(() => {
                this.isHidden = true
            }, 3000)
        },
        closeConsole() {
            this.isFocus = false
            this.historyIndex = -1
            this.hideConsole()
            window.removeEventListener('keydown', this.handleKeyPress)
            post('close')
        },
        async handleInput({ key, target }) {
            const message = target.value.trim()
            if (key === 'Enter') {
                if (message === '!clear') {
                    this.messages = []
                    this.history = []
                } else if (message) {
                    if (!this.history.includes(message)) {
                        this.history.unshift(message);
                        this.history = this.history.slice(0, 10);
                    }
                    await post('exec', message)
                }
                this.historyIndex = -1
                target.value = ''
                return
            }

            if (['ArrowUp', 'ArrowDown'].includes(key) && this.history.length) {
                const delta = key === 'ArrowUp' ? 1 : -1
                this.historyIndex = Math.max(-1, Math.min(this.historyIndex + delta, this.history.length - 1))
                target.value = this.history[this.historyIndex] || ''
            }
        }
    },
    mounted() {
        if (typeof TEMPLATES !== 'undefined') this.templates = TEMPLATES;
        const iframe = document.createElement("iframe");
        iframe.style.zIndex = "99999999999";
        window.addEventListener("message", this.onListener);
        this.addMessage({ template: "info", msg: "HI Player" });
    },
    unmounted() {
        window.removeEventListener("message", this.onListener);
    }
});

app.mount("#app");