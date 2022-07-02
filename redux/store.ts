import { configureStore, ThunkAction, Action } from "@reduxjs/toolkit";
import uiSlices from "./slices/ui.slices";
import cartSlices from "./slices/cart.slices";
import paymentSlices from "./slices/payment.slices";

const store = configureStore({
    reducer: {
        ui: uiSlices,
        cart: cartSlices,
        payment: paymentSlices
    }
})

export default store;

export type AppDispatch = typeof store.dispatch;
export type RootState = ReturnType<typeof store.getState>;
export type AppThunk<Returntype = void> = ThunkAction<
    Returntype,
    RootState,
    unknown,
    Action<string>
>;

