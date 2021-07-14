module.exports = class Produto {

    constructor(options) {
        this.id = options ? options.id : null;;
        this.brand = options ? options.brand : null;;
        this.image = options ? options.image : null;;
        this.price = options ? options.price : null;;
        this.title = options ? options.title : null;;
    }

}