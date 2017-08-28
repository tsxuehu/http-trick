
import _ from 'lodash'
export default function addHeaderToResponse(response, headers) {
    _.forEach(headers,(value,key)=>{
        response.setHeader(key, value);
    })
}