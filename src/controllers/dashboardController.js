import prisma from '../models/prisma.js';

export const getSummary = async (req, res, next) => {
  try {
    const aggregations = await prisma.financialRecord.groupBy({
      by: ['type'],
      where: { isDeleted: false },
      _sum: { amount: true }
    });

    let totalIncome = 0;
    let totalExpense = 0;

    aggregations.forEach(agg => {
      if (agg.type === 'INCOME') totalIncome = agg._sum.amount || 0;
      if (agg.type === 'EXPENSE') totalExpense = agg._sum.amount || 0;
    });

    const categoryAggregations = await prisma.financialRecord.groupBy({
      by: ['category', 'type'],
      where: { isDeleted: false },
      _sum: { amount: true }
    });

    const recentActivity = await prisma.financialRecord.findMany({
      where: { isDeleted: false },
      orderBy: { createdAt: 'desc' },
      take: 5
    });

    res.status(200).json({
      totalIncome,
      totalExpenses: totalExpense,
      netBalance: totalIncome - totalExpense,
      categoryWise: categoryAggregations.map(c => ({
        category: c.category,
        type: c.type,
        total: c._sum.amount
      })),
      recentActivity
    });
  } catch (err) {
    next(err);
  }
};
