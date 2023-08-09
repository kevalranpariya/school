import { Router } from 'express';
import { ReportController } from '../controller';
import checkUserRole from '../middleware/checkUserRole';

export default (route:Router):Router => {
  const reportController = new ReportController();

  route.post('/addReport', checkUserRole(['teacher']), reportController.addReport);
  route.get('/viewReport', checkUserRole(['principal']), reportController.viewReport);
  route.put('/updateReport/:id', checkUserRole(['teacher']), reportController.updateReport);
  route.delete('/deleteReport/:id', checkUserRole(['teacher']), reportController.deleteReport);
  return route;
};