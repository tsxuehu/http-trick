/**
 * Created by tsxuehu on 17/1/9.
 */

import axios from 'axios';

export function saveFile(content: any) {
    return axios.post('/configure/savefile', content);
}
