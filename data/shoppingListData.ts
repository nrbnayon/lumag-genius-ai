export interface ShoppingListItem {
  id: string;
  name: string;
  isMissing: boolean;
  isOther?: boolean;
  otherValue?: string;
}

export const initialShoppingList: ShoppingListItem[] = [
  { id: "1", name: "Tomatoes", isMissing: false },
  { id: "2", name: "Chicken Breast", isMissing: true },
  { id: "3", name: "Salmon", isMissing: false },
  { id: "4", name: "Milk", isMissing: false },
  { id: "5", name: "Eggs", isMissing: true },
  { id: "6", name: "Flour", isMissing: false },
  { id: "7", name: "Olive Oil", isMissing: false },
  { id: "8", name: "Onions", isMissing: true },
];
