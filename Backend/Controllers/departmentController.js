const Department = require("../Model/Department");

// ✅ Get all departments with trend info
exports.getDepartments = async (req, res) => {
  try {
    const depts = await Department.find();
    
    // Add trend info for frontend
    const deptsWithTrend = depts.map((d) => ({
      ...d._doc,
      trend: d.performanceThisMonth - d.performanceLastMonth, // positive = ↑, negative = ↓
    }));

    res.json(deptsWithTrend);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// ✅ Create department
exports.createDepartment = async (req, res) => {
  try {
    const dept = new Department(req.body);
    await dept.save();
    res.json(dept);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// ✅ Update department (name, employees, performance)
exports.updateDepartment = async (req, res) => {
  try {
    const updated = await Department.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
    });
    res.json(updated);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// ✅ Delete department
exports.deleteDepartment = async (req, res) => {
  try {
    await Department.findByIdAndDelete(req.params.id);
    res.json({ message: "Department deleted" });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// ✅ Dynamic performance update endpoint
exports.updatePerformance = async (req, res) => {
  try {
    const departments = await Department.find();

    const updatedDepts = await Promise.all(
      departments.map(async (d) => {
        // Simple dynamic logic: performanceThisMonth = lastMonth ± random change
        const change = Math.floor(Math.random() * 21) - 10; // random between -10 and +10
        const newPerformance = Math.max(0, Math.min(100, d.performanceLastMonth + change));

        const updatedDept = await Department.findByIdAndUpdate(
          d._id,
          { performanceLastMonth: d.performanceThisMonth, performanceThisMonth: newPerformance },
          { new: true }
        );

        return {
          ...updatedDept._doc,
          trend: newPerformance - updatedDept.performanceLastMonth,
        };
      })
    );

    res.json(updatedDepts);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};
