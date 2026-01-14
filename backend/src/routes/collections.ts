import { Router } from 'express';
import { collectionController } from '../controllers/collectionController';

const router = Router();

// Collection routes
router.get('/user/:userId', collectionController.getUserCollections.bind(collectionController));
router.post('/', collectionController.createCollection.bind(collectionController));
router.patch('/:id', collectionController.updateCollection.bind(collectionController));
router.delete('/:id', collectionController.deleteCollection.bind(collectionController));

export const collectionRouter = router;