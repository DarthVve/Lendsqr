import axios from 'axios';
import { banks as fallbackBanks } from './getBanks';

export const cachedBanks: any[] = [];


//Hits flutterwave's endpoint and retrieve's an array of bank information
export const getBanks = async () => {
  try {
    if (cachedBanks.length) {
      return cachedBanks;
    } else {
      const { data } = await axios.get('https://api.flutterwave.com/v3/banks/NG', {
        headers: {
          "Content-Type": "application/json",
          'Authorization': 'Bearer ' + process.env.FLW_SECRET_KEY
        }
      });
      if (data.status === 'error') {
        console.log('Check status code it may 500, a flutterwave error');
      }
      cachedBanks.push(...data.data);
      return data.data;
    }
  } catch (error) {
    console.error(error);
    cachedBanks.push(...fallbackBanks);
    return cachedBanks;
  }
};


