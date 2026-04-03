import prisma from '../models/prisma.js';

export const createRecord = async (req, res, next) => {
  try {
    const record = await prisma.financialRecord.create({
      data: {
        ...req.body,
        date: new Date(req.body.date),
        userId: req.userId
      }
    });
    res.status(201).json(record);
  } catch (err) {
    next(err);
  }
};

export const getRecords = async (req, res, next) => {
  try {
    const { type, category, startDate, endDate, search, page = 1, limit = 10 } = req.query;

    const where = { isDeleted: false };
    if (type) where.type = type;
    if (category) where.category = category;
    if (startDate || endDate) {
      where.date = {};
      if (startDate) where.date.gte = new Date(startDate);
      if (endDate) where.date.lte = new Date(endDate);
    }
    if (search) {
      where.notes = { contains: search, mode: 'insensitive' };
    }

    const skip = (parseInt(page) - 1) * parseInt(limit);
    
    const [records, total] = await Promise.all([
      prisma.financialRecord.findMany({
        where,
        skip,
        take: parseInt(limit),
        orderBy: { date: 'desc' }
      }),
      prisma.financialRecord.count({ where })
    ]);

    res.status(200).json({
      data: records,
      meta: { total, page: parseInt(page), limit: parseInt(limit) }
    });
  } catch (err) {
    next(err);
  }
};

export const updateRecord = async (req, res, next) => {
  try {
    const { id } = req.params;
    
    const existing = await prisma.financialRecord.findUnique({ where: { id } });
    if (!existing || existing.isDeleted) {
      return res.status(404).json({ error: 'Record not found' });
    }

    const updateData = { ...req.body };
    if (updateData.date) updateData.date = new Date(updateData.date);

    const record = await prisma.financialRecord.update({
      where: { id },
      data: updateData
    });

    res.status(200).json(record);
  } catch (err) {
    next(err);
  }
};

export const deleteRecord = async (req, res, next) => {
  try {
    const { id } = req.params;
    
    const existing = await prisma.financialRecord.findUnique({ where: { id } });
    if (!existing || existing.isDeleted) {
      return res.status(404).json({ error: 'Record not found' });
    }

    await prisma.financialRecord.update({
      where: { id },
      data: { isDeleted: true }
    });

    res.status(200).json({ message: 'Record deleted successfully' });
  } catch (err) {
    next(err);
  }
};
