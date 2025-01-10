import {configureStore} from '@reduxjs/toolkit'
import userReducer  from './features/slice'

const store= configureStore(
    {
        reducer:
        {
            userInfo:userReducer,
        }
    }
)

export default store;