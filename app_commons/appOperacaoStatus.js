module.exports = class AppOperacaoStatus {

    constructor(options) {
        this.status = options ? options.status : null;
        this.data = options ? options.data : null;
        this.hasError = this.status >= 300;
    }

}