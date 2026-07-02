export const updateLifeField = (set, key, val) => {
  set(prev => ({ ...prev, [key]: val }));
};

export const addChild = (set, count) => {
  const id = `child_${Date.now()}`;
  const newChild = {
    id,
    name: `第${count + 1}子`,
    birthYear: 3,
    eduPattern: 0,
    birthCost: 500_000,
    annualChildcareCost: 300_000
  };

  set(prev => ({
    ...prev,
    children: [...prev.children, newChild]
  }));
};

export const updateChildField = (set, id, key, val) => {
  set(prev => ({
    ...prev,
    children: prev.children.map(c =>
      c.id === id ? { ...c, [key]: val } : c
    )
  }));
};

export const removeChild = (set, id) => {
  set(prev => ({
    ...prev,
    children: prev.children.filter(c => c.id !== id)
  }));
};
