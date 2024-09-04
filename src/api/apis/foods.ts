import { authInstance } from '../util/instance';

export const postAllFoods = async () => {
  try {
    const response = await authInstance.post('/api/foods/recommends/', {
      filters: {
        is_lunch: false,
        is_dinner: false,
        is_snack: false,
        is_date: false,
        is_party: false,
        is_diet: false,
      },
      recommends_cnt: 5,
    });
    return response.data;
  } catch (error) {
    console.error('Failed to get foods:', error);
    throw error;
  }
};
