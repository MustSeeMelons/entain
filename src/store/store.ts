import { configureStore } from "@reduxjs/toolkit";
import { globalReducer } from "./global-slice";
import { useDispatch, useSelector } from "react-redux";

export const store = configureStore({ reducer: { globalReducer }, devTools: true });

// Derived Redux types
export type AppState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;

// // Types version of the generic useDispatch/useSelector
export const useAppDispatch = useDispatch.withTypes<AppDispatch>();
export const useAppSelector = useSelector.withTypes<AppState>();
