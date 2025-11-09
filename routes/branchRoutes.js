import express from 'express';
import {
  getBranches,
  getBranchById,
  createBranch,
  updateBranch,
  deleteBranch,
} from '../controllers/branchController.js';

const branchRouter = express.Router();

branchRouter.get('/', getBranches);
branchRouter.get('/:id', getBranchById);
branchRouter.post('/', createBranch);
branchRouter.put('/:id', updateBranch);
branchRouter.delete('/:id', deleteBranch);

export default branchRouter;
