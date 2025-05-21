const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

exports.createReview = async (req, res) => {
  const { camperId, rating, comment } = req.body;
  const userId = req.userId;
  try {
    const review = await prisma.review.create({
      data: { camperId: parseInt(camperId), userId, rating, comment },
    });
    res.status(201).json(review);
  } catch (error) {
    res.status(500).json({ error: 'Failed to create review' });
  }
};

exports.deleteReview = async (req, res) => {
  const reviewId = parseInt(req.params.id, 10);
  try {
    await prisma.review.delete({ where: { id: reviewId } });
    res.status(200).json({ message: 'Review deleted' });
  } catch (error) {
    res.status(500).json({ error: 'Failed to delete review' });
  }
};

exports.getReviewsForCamper = async (req, res) => {
  const camperId = parseInt(req.params.camperId, 10);
  try {
    const reviews = await prisma.review.findMany({
      where: { camperId },
      include: { user: true },
    });
    res.status(200).json(reviews);
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch reviews' });
  }
};