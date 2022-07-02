import { createSlice, PayloadAction, ThunkAction } from '@reduxjs/toolkit';

const initialState={
    sideMenu:false,
    searchNavbar:false
}


const uiSlices = createSlice({
    name:"ui",
    initialState,
    reducers:{
        toggleSideMenu(state){
            state.sideMenu=!state.sideMenu
        },
        openSideMenu(state){
            state.sideMenu=true
        },
        closeSideMenu(state){
            state.sideMenu=false
        },
        openSearchNavbar(state){
            state.searchNavbar=true
        },
        closeSearchNavbar(state){
            state.searchNavbar=false
        },

    }
}) 


    


export const { toggleSideMenu, openSideMenu, closeSideMenu, openSearchNavbar, closeSearchNavbar } = uiSlices.actions;
export default uiSlices.reducer;