import axios from "axios";

const tesloApiBase= axios.create({
    baseURL:'/api'
})

export default tesloApiBase;