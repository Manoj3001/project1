import {createAsyncThunk, createSlice} from '@reduxjs/toolkit'
import axios from 'axios';

const initialState=
{
    status:'idle',
    error:null
}

const USER_URL ="http://localhost:5000/allusers";



export const fetchallusers= createAsyncThunk('users/fetchallusers', async()=>
{
    try
    {
        const res= await axios.get(USER_URL)
        return res.data
    }
    catch(err)
    {
        return err;
    }
})



export const userSlice= createSlice(
    {
        name:'users',
        initialState,
        reducers:{

        },

        extraReducers:(builder)=>
        {
            builder

            .addCase(fetchallusers.pending,(state)=>
            {
                state.status='loading';
            })

            .addCase(fetchallusers.fulfilled,(state,action)=>
            {
                state.status="succeeded";
                state.users=action.payload;
                state.error=null;
            })

            .addCase(fetchallusers.rejected,(state,action)=>
            {
                state.status="failed";
                state.error=action.error.message
            })
        }

    }
)



export const getAllUsers=(state)=>state.userInfo.users;
export default userSlice.reducer