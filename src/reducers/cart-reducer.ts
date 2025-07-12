import { db } from "../data/db";
import { CartItem, Guitar } from "../types";

export type CartActions =
    { type: 'add-to-cart', payload: { item: Guitar } } |
    { type: 'remove-from-cart', payload: { id: Guitar['id'] } } |
    { type: 'increment-quantity', payload: { id: Guitar['id'] } } |
    { type: 'decrement-quantity', payload: { id: Guitar['id'] } } |
    { type: 'clear-cart' }

export type CartState = {
    data: Guitar[]
    cart: CartItem[]
}

const initialCart = () : CartItem[] => {
    const localStorageCart = localStorage.getItem("cart");
    return localStorageCart ? JSON.parse(localStorageCart) : []
}

export const initialState: CartState = {
    data: db,
    cart: initialCart()
}

const MAX_ITEMS = 5
const MIN_ITEMS = 1

export const cartReducer = (
    state: CartState = initialState,
    action: CartActions
) => {
    if (action.type === 'add-to-cart') {

        const itemExists = state.cart.find(guitar => guitar.id === action.payload.item.id)
        let updateCarts :  CartItem[] = []
        if (itemExists) {
            updateCarts = state.cart.map(item =>{
                if (item.id === action.payload.item.id) {
                    if (item.quantity < MAX_ITEMS) {
                        return {...item, quantity : item.quantity + 1 }
                    }else{
                        return item
                    }
                }else{
                    return item
                }  
            })
        } else {
            const newItem: CartItem = { ...action.payload.item, quantity: 1 }
            updateCarts = [...state.cart, newItem]
        }
        return {
            ...state,
            cart: updateCarts
        }
    }
    if (action.type === 'remove-from-cart') {
        const cart = state.cart.filter(item => item.id !== action.payload.id)
        return {
            ...state,
            cart
        }
    }
    if (action.type === 'increment-quantity') {
        const cart = state.cart.map(item => {
            if (item.id === action.payload.id && item.quantity < MAX_ITEMS) {
                return {
                    ...item,
                    quantity: item.quantity + 1
                }
            }
            return item
        })
        return {
            ...state,
            cart
        }
    }
    if (action.type === 'decrement-quantity') {
        const cart = state.cart.map(item => {
            if (item.id === action.payload.id && item.quantity > MIN_ITEMS) {
                return {
                    ...item,
                    quantity: item.quantity - 1
                }
            }
            return item
        })

        return {
            ...state,
            cart
        }
    }
    if (action.type === 'clear-cart') {
        return {
            ...state,
            cart: []
        }
    }

    return state
}