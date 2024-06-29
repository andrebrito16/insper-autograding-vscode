import api from '../../../../services/api';

interface JSONResponse {
  Tarefa: string;
  Nota: number;
};

export async function indexGradesJSON(token: string, subject: string, offer: string) {
  const response = await api.get<JSONResponse[]>(`grade_by_task/${subject}/${offer}`, {
    headers: {
      Authorization: `Bearer ${token}`,
      "Accept": "application/json",
    },
  });
  
  return response;
}