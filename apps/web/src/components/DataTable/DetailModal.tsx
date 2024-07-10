import React, { useEffect, useState } from 'react';

import { DateValue, parseAbsoluteToLocal } from '@internationalized/date';
import {
  Button,
  DateInput,
  Input,
  Modal,
  ModalBody,
  ModalContent,
  ModalFooter,
  ModalHeader,
  Select,
  SelectItem,
} from '@nextui-org/react';

interface DetailModalProps<T> {
  item?: T | null;
  onClose: () => void;
  updateItem?: (updatedItem: T) => Promise<void>;
  keysToDisabled?: string[];
}

interface NewKeyValueState {
  key: string;
  value: any;
  type: string;
}

const DetailModal = <T,>(props: DetailModalProps<T>) => {
  const { item, onClose, updateItem, keysToDisabled = [] } = props;
  const [editedItem, setEditedItem] = useState<T | null>(null);
  const [newKeyValues, setNewKeyValues] = useState<Record<string, NewKeyValueState>>({});
  const [updateLoading, setUpdateLoading] = useState(false);

  useEffect(() => {
    if (item) {
      setEditedItem(JSON.parse(JSON.stringify(item)));
    }
  }, [item]);

  const handleChange = (path: string, value: any) => {
    if (!editedItem || !updateItem) return;
    const newItem = { ...editedItem };
    setNestedValue(newItem, path, value);
    setEditedItem(newItem);
  };

  const setNestedValue = (obj: any, path: string, value: any) => {
    const keys = splitPath(path);
    let current = obj;

    for (let i = 0; i < keys.length - 1; i++) {
      const key = keys[i];
      const nextKey = keys[i + 1];
      const isNextKeyNumeric = !isNaN(Number(nextKey));

      if (current[key] === undefined) {
        current[key] = isNextKeyNumeric ? [] : {};
      }

      if (Array.isArray(current[key]) && isNextKeyNumeric) {
        const index = Number(nextKey);
        if (current[key].length <= index) {
          current[key][index] = i === keys.length - 2 ? value : {};
        }
      }

      current = current[key];
    }

    const lastKey = keys[keys.length - 1];
    current[lastKey] = value;
  };

  const getNestedValue = (obj: any, path: string) => {
    const keys = splitPath(path);
    return keys.reduce((acc, key) => {
      if (acc === undefined) return acc;
      return acc[key];
    }, obj);
  };

  const splitPath = (path: string) => {
    const keys = [];
    let currentKey = '';
    for (let i = 0; i < path.length; i++) {
      const char = path[i];
      if (char === '.' || char === '[' || char === ']') {
        if (currentKey) {
          keys.push(currentKey);
          currentKey = '';
        }
      } else {
        currentKey += char;
      }
    }
    if (currentKey) {
      keys.push(currentKey);
    }
    return keys;
  };

  const isTimestamp = (key: string) => key.endsWith('_at') || key.endsWith('_date');

  const timestampToDateValue = (timestamp: number): DateValue => {
    return parseAbsoluteToLocal(new Date(timestamp).toISOString());
  };

  const dateValueToTimestamp = (date: DateValue): number => {
    return date.toDate('UTC').getTime();
  };

  const isFieldDisabled = (path: string) => {
    return (
      !updateItem ||
      keysToDisabled.includes(path) ||
      ['pk', 'sk', 'id', 'created_at', 'updated_at', 'data_type'].includes(path.split('.').pop() || '')
    );
  };

  const handleAddNewKeyValue = (path: string) => {
    if (!editedItem || !updateItem) return;
    const { key, value, type } = newKeyValues[path] || { key: '', value: '', type: 'string' };
    if (!key) return;

    const newItem = { ...editedItem };
    let finalValue = value;
    if (type === 'boolean') finalValue = value === 'true';
    if (type === 'number') finalValue = Number(value);
    if (type === 'date') finalValue = new Date(value).getTime();

    const fullPath = path ? `${path}.${key}` : key;
    setNestedValue(newItem, fullPath, finalValue);
    setEditedItem(newItem);

    setNewKeyValues((prev) => ({
      ...prev,
      [path]: { key: '', value: '', type: 'string' },
    }));
  };

  const renderInputs = (obj: any, prefix = '') => {
    if (!obj) return null;

    const renderField = (key: string, value: any, fullPath: string) => {
      const type = isTimestamp(key) ? 'date' : typeof value;
      const label = `${fullPath} (${type})`;
      const isDisabled = isFieldDisabled(fullPath);

      if (isTimestamp(key)) {
        return (
          <div key={fullPath} className="mb-4">
            <DateInput
              label={label}
              value={timestampToDateValue(value)}
              onChange={(date) => !isDisabled && handleChange(fullPath, dateValueToTimestamp(date))}
              isDisabled={isDisabled}
              granularity="second"
            />
          </div>
        );
      }

      if (type === 'boolean') {
        return (
          <div key={fullPath} className="mb-4">
            <Select
              aria-label="boolean select"
              label={label}
              value={value.toString()}
              defaultSelectedKeys={[value.toString()]}
              onChange={(e) => !isDisabled && handleChange(fullPath, e.target.value === 'true')}
              isDisabled={isDisabled}
            >
              <SelectItem key="true" value="true">
                True
              </SelectItem>
              <SelectItem key="false" value="false">
                False
              </SelectItem>
            </Select>
          </div>
        );
      }

      return (
        <div key={fullPath} className="mb-4">
          <Input
            label={label}
            value={value !== undefined ? String(value) : ''}
            onChange={(e) =>
              !isDisabled && handleChange(fullPath, type === 'number' ? Number(e.target.value) : e.target.value)
            }
            type={type === 'number' ? 'number' : 'text'}
            isDisabled={isDisabled}
            fullWidth
          />
        </div>
      );
    };

    const renderObject = (objValue: any, objPath: string) => {
      return (
        <div key={objPath} className="mb-4 p-4 border border-gray-200 rounded">
          <h4 className="text-lg font-semibold mb-2">{objPath} (object)</h4>
          {Object.entries(objValue)
            .sort(([a], [b]) => a.localeCompare(b))
            .map(([subKey, subValue]) => {
              const subPath = `${objPath}.${subKey}`;
              if (typeof subValue === 'object' && subValue !== null) {
                return Array.isArray(subValue) ? renderArray(subValue, subPath) : renderObject(subValue, subPath);
              } else {
                return renderField(subKey, subValue, subPath);
              }
            })}
          {renderAddNewKeyValue(objPath)}
        </div>
      );
    };

    const renderArray = (arrayValue: any[], arrayPath: string) => {
      return (
        <div key={arrayPath} className="mb-4">
          <h4 className="text-lg font-semibold mb-2">{arrayPath} (array)</h4>
          {arrayValue.map((item, index) => {
            const itemPath = `${arrayPath}[${index}]`;
            return (
              <div key={itemPath} className="mb-4 p-4 border border-gray-200 rounded">
                {typeof item === 'object' && item !== null
                  ? Object.entries(item).map(([subKey, subValue]) => {
                      const subPath = `${itemPath}.${subKey}`;
                      return typeof subValue === 'object' && subValue !== null
                        ? Array.isArray(subValue)
                          ? renderArray(subValue, subPath)
                          : renderObject(subValue, subPath)
                        : renderField(subKey, subValue, subPath);
                    })
                  : renderField(String(index), item, itemPath)}
                {updateItem && (
                  <div className="mt-2 text-right">
                    <Button color="danger" size="sm" onClick={() => handleRemoveArrayItem(arrayPath, index)}>
                      Remove
                    </Button>
                  </div>
                )}
                {renderAddNewKeyValue(itemPath)}
              </div>
            );
          })}
          {updateItem && (
            <Button onClick={() => handleAddArrayItem(arrayPath)} className="mt-2">
              Add Item ({arrayPath})
            </Button>
          )}
        </div>
      );
    };

    const renderAddNewKeyValue = (path: string) => {
      if (!updateItem) return null;
      const newKeyValue = newKeyValues[path] || { key: '', value: '', type: 'string' };

      return (
        <div className="mt-4 p-4 border border-dashed border-gray-300 rounded">
          <h5 className="text-md font-semibold mb-2">Add New Key-Value Pair</h5>
          <div className="flex gap-2 mb-2">
            <Input
              placeholder="New Key"
              value={newKeyValue.key}
              onChange={(e) =>
                setNewKeyValues((prev) => ({
                  ...prev,
                  [path]: { ...newKeyValue, key: e.target.value },
                }))
              }
              className="flex-grow"
            />
            <Select
              aria-label="type select"
              value={newKeyValue.type}
              defaultSelectedKeys={['string']}
              onChange={(e) =>
                setNewKeyValues((prev) => ({
                  ...prev,
                  [path]: { ...newKeyValue, type: e.target.value },
                }))
              }
            >
              <SelectItem key="string" value="string">
                String
              </SelectItem>
              <SelectItem key="number" value="number">
                Number
              </SelectItem>
              <SelectItem key="boolean" value="boolean">
                Boolean
              </SelectItem>
              <SelectItem key="date" value="date">
                Date
              </SelectItem>
            </Select>
          </div>
          {newKeyValue.type === 'boolean' ? (
            <Select
              aria-label="boolean select"
              value={newKeyValue.value}
              onChange={(e) =>
                setNewKeyValues((prev) => ({
                  ...prev,
                  [path]: { ...newKeyValue, value: e.target.value },
                }))
              }
              className="mb-2"
            >
              <SelectItem key="true" value="true">
                True
              </SelectItem>
              <SelectItem key="false" value="false">
                False
              </SelectItem>
            </Select>
          ) : newKeyValue.type === 'date' ? (
            <DateInput
              value={newKeyValue.value ? parseAbsoluteToLocal(new Date(newKeyValue.value).toISOString()) : undefined}
              onChange={(date) =>
                setNewKeyValues((prev) => ({
                  ...prev,
                  [path]: { ...newKeyValue, value: date ? date.toDate().toISOString() : '' },
                }))
              }
              className="mb-2"
            />
          ) : (
            <Input
              placeholder="New Value"
              value={newKeyValue.value}
              onChange={(e) =>
                setNewKeyValues((prev) => ({
                  ...prev,
                  [path]: { ...newKeyValue, value: e.target.value },
                }))
              }
              type={newKeyValue.type === 'number' ? 'number' : 'text'}
              className="mb-2"
            />
          )}
          <Button onClick={() => handleAddNewKeyValue(path)}>Add</Button>
        </div>
      );
    };

    return (
      <>
        {Object.entries(obj)
          .sort(([a], [b]) => a.localeCompare(b))
          .map(([key, value]) => {
            const fullPath = prefix ? `${prefix}.${key}` : key;
            if (typeof value === 'object' && value !== null) {
              return Array.isArray(value) ? renderArray(value, fullPath) : renderObject(value, fullPath);
            } else {
              return renderField(key, value, fullPath);
            }
          })}
        {renderAddNewKeyValue(prefix)}
      </>
    );
  };

  const handleAddArrayItem = (path: string) => {
    if (!editedItem || !updateItem) return;
    const newItem = { ...editedItem };
    const array = getNestedValue(newItem, path);
    if (Array.isArray(array)) {
      const newElement = array.length > 0 ? { ...array[array.length - 1] } : {};
      if (typeof newElement === 'object') {
        Object.keys(newElement).forEach((key) => {
          if (typeof newElement[key] === 'object' && newElement[key] !== null) {
            newElement[key] = Array.isArray(newElement[key]) ? [] : {};
          } else {
            newElement[key] = '';
          }
        });
      }
      setNestedValue(newItem, `${path}[${array.length}]`, newElement);
      setEditedItem(newItem);
    }
  };

  const handleRemoveArrayItem = (path: string, index: number) => {
    if (!editedItem || !updateItem) return;
    const newItem = { ...editedItem };
    const array = getNestedValue(newItem, path);
    if (Array.isArray(array) && index >= 0 && index < array.length) {
      array.splice(index, 1);
      setNestedValue(newItem, path, array);
      setEditedItem(newItem);
    }
  };

  const handleUpdate = async () => {
    if (editedItem && updateItem) {
      setUpdateLoading(true);
      await updateItem(editedItem);
      setUpdateLoading(false);
    }
  };

  return (
    <Modal
      className="min-w-[40vw]"
      scrollBehavior="inside"
      isOpen={!!item}
      onOpenChange={(isOpen) => {
        if (!isOpen) onClose();
      }}
    >
      <ModalContent>
        <ModalHeader>{updateItem ? 'Edit Item' : 'Item Details'}</ModalHeader>
        <ModalBody>{editedItem && renderInputs(editedItem)}</ModalBody>
        <ModalFooter>
          {updateItem && (
            <Button color="primary" onClick={handleUpdate} isLoading={updateLoading}>
              Update
            </Button>
          )}
        </ModalFooter>
      </ModalContent>
    </Modal>
  );
};

export default DetailModal;
