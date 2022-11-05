import axios from 'axios';
import baseURL from "@/libs/axios";

export async function getAllNames() {
    const response = await axios.get(`${baseURL}&handler=accounting_periods&dataset=periods`);
    return response.data;
}

export async function getDivisions() {
    const response = await axios.get(`${baseURL}&handler=divisions&dataset=list_divisions`);
    return response.data;
}

export async function getCostcodes(division_id) {
    const response = await axios.get(`${baseURL}&handler=costcodes&dataset=list_cost_codes&division_id=${division_id}`);
    return response.data;
}

export async function getAccounts() {
    const response = await axios.get(`${baseURL}&handler=gl_account&dataset=accounts`);
    return response.data;
}
