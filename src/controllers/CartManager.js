import {promises as fs, readFile} from 'fs';
import { nanoid } from 'nanoid';
import ProductManager from './ProductManager.js';

const productAll = new ProductManager

class CartManager {
    constructor() {
        this.path = "./src/models/carts.json";
    }

    readCarts = async () => {
        let cart = await fs.readFile(this.path, "utf-8")
        return JSON.parse(cart);
    };

    writeCarts = async (cart) => {
        await fs.writeFile(this.path,JSON.stringify(cart));
    };

    exist = async (id) => {
        let carts = await this.readCarts();
        return carts.find(prod => prod.id === id)
    }

    addCarts = async () => {
        let cartsOld = await this.readCarts();
        let id = nanoid()
        let cartsConcat = [{id : id, products : {}}, ...cartsOld]
        await this.writeCarts(cartsConcat)
        return "El carrito fue agregado"
    }

    getCartById = async (id) => {
        
        let cartById = await this.exist(id)
        if(!cartById) return "El carrito no  fue encontrado"
        return cartById
    };

    addProductInCart = async (cartId, productId) => {
        let cartById = await this.exist(cartId)
        if(!cartById) return "El carrito no  fue encontrado"
        let productById = await productAll.exist(productId)
        if(!cartById) return "El producto no  fue encontrado"
        let cartsAll = await this.readCarts()
        let cartFilter = cartsAll.filter(cart => cart.id != cartId)
        
        if(cartById.products.some(prod => prod.id === productId)){
            let moreProductInCart = cartById.products.find(prod => prod.id === productId);
            moreProductInCart.cantidad + 1
            let cartsConcat = [moreProductInCart, ...cartFilter]
            await this.writeCarts(cartsConcat)
            return "El producto se sumo al carrito"
        }
        cartById.products.push({id:productById.id, cantidad:1})
        
        let cartsConcat = [{id:cartId, products : []}, ...cartFilter,];
        await this.writeCarts(cartsConcat);
        return "El producto fue agregado al carrito";
        
    };
}

export default CartManager;