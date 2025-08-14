import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import api from "../../utils/api";

// Get all transactions
export const fetchTransactions = createAsyncThunk(
  "transactions/fetchAll",
  async (_, thunkAPI) => {
    try {
      const { data } = await api.get("/transactions");
      return data;
    } catch (err) {
      return thunkAPI.rejectWithValue(
        err.response?.data?.message || "Failed to fetch"
      );
    }
  }
);

// Create new transaction
export const addTransaction = createAsyncThunk(
  "transactions/add",
  async (transactionData, thunkAPI) => {
    try {
      const { data } = await api.post("/transactions", transactionData);
      return data;
    } catch (err) {
      return thunkAPI.rejectWithValue(
        err.response?.data?.message || "Failed to add"
      );
    }
  }
);

export const searchTransactions = createAsyncThunk(
  "transactions/search",
  async (filters, thunkAPI) => {
    try {
      const { data } = await api.get("/transactions", { params: filters });
      return data; // contains { transactions, totalPages, currentPage }
    } catch (err) {
      return thunkAPI.rejectWithValue(
        err.response?.data?.message || "Search failed"
      );
    }
  }
);

const transactionsSlice = createSlice({
  name: "transactions",
  initialState: {
    items: [],
    totalPages: 1,
    currentPage: 1,
    isLoading: false,
    isError: false,
    message: "",
    isAdding: false,
  },
  reducers: {},
  extraReducers: (builder) => {
    builder
      // fetch
      .addCase(fetchTransactions.pending, (s) => {
        s.isLoading = true;
        s.isError = false;
        s.message = "";
      })
      .addCase(fetchTransactions.fulfilled, (s, { payload }) => {
        s.isLoading = false;
        s.items = payload.transactions; // not payload
        s.totalPages = payload.totalPages;
        s.currentPage = payload.currentPage;
      })

      .addCase(fetchTransactions.rejected, (s, { payload }) => {
        s.isLoading = false;
        s.isError = true;
        s.message = payload;
      })
      // add
      .addCase(addTransaction.fulfilled, (s, { payload }) => {
        s.isAdding = false;
        s.items.unshift(payload); // put new one on top
      })
      .addCase(addTransaction.pending, (s) => {
        s.isAdding = true;
        s.isError = false;
      })
      .addCase(searchTransactions.pending, (s) => {
        s.isLoading = true;
        s.isError = false;
      })
      .addCase(searchTransactions.fulfilled, (s, { payload }) => {
        s.isLoading = false;
        s.searchResults = payload.transactions;
        s.totalPages = payload.totalPages;
        s.currentPage = payload.currentPage;
      })
      .addCase(searchTransactions.rejected, (s, { payload }) => {
        s.isLoading = false;
        s.isError = true;
        s.message = payload;
      });
  },
});

export default transactionsSlice.reducer;
