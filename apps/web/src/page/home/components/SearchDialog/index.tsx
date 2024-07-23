import React, { useCallback, useEffect, useMemo, useState } from 'react';

import { useRouter } from 'next/navigation';

import { Button, Input } from '@junhobaik/ui';
import { Kbd, Modal, ModalBody, ModalContent, ModalHeader } from '@nextui-org/react';
import { IconSearch } from '@tabler/icons-react';
import clsx from 'clsx';

import useSearchArticles from '@/hooks/useSearchArticles';

const SearchDialog = () => {
  const router = useRouter();

  const [searchValue, setSearchValue] = useState('');
  const [isOpen, setIsOpen] = useState(false);
  const [selectedIndex, setSelectedIndex] = useState(0);

  const { items } = useSearchArticles({ searchValue, hitsPerPage: 10, publishedOnly: true });

  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      if ((event.ctrlKey || event.metaKey) && event.key === 'k') {
        event.preventDefault();
        setIsOpen(true);
      }
    };

    window.addEventListener('keydown', handleKeyDown);

    return () => {
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, []);

  const toggleModal = useCallback(() => setIsOpen((prev) => !prev), []);

  const prefetchArticle = useCallback(() => {
    if (items[selectedIndex]) router.prefetch(`/${items[selectedIndex].pathname}`);
  }, [items, selectedIndex, router]);

  const handleInputChange = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchValue(e.target.value);
    setSelectedIndex(0);
  }, []);

  const handleKeyUp = useCallback(
    (e: React.KeyboardEvent<HTMLInputElement>) => {
      switch (e.key) {
        case 'ArrowDown':
          if (items.length > selectedIndex + 1) {
            setSelectedIndex((prev) => prev + 1);
            prefetchArticle();
          }
          break;
        case 'ArrowUp':
          if (selectedIndex > 0) {
            setSelectedIndex((prev) => prev - 1);
            prefetchArticle();
          }
          break;
        case 'Enter':
          if (items.length && items[selectedIndex]) {
            router.push(`/${items[selectedIndex].pathname}`);
            setIsOpen(false);
          }
          break;
      }
    },
    [items, selectedIndex, prefetchArticle, router],
  );

  const renderSearchResults = useMemo(() => {
    if (!items.length) {
      if (!searchValue) return <p className="text-gray-400 text-center py-4">Enter search keyword</p>;
      return <p className="text-red-400 text-center py-4">No results found</p>;
    }

    return (
      <ul>
        {items.map((article, i) => (
          <li key={`search-item-${article.id}`} className={clsx('px-4 py-2', { 'bg-gray-200': selectedIndex === i })}>
            <p>{article.title}</p>
          </li>
        ))}
      </ul>
    );
  }, [items, searchValue, selectedIndex]);

  return (
    <>
      <Button
        variant="flat"
        color="default"
        onClick={toggleModal}
        size="xs"
        radius="xl"
        startContent={<IconSearch size={16} className="min-w-[16px]" />}
        endContent={<Kbd keys={['command']}>K</Kbd>}
      >
        <p className="w-0 sm:w-full overflow-hidden transition-width">Quick Search</p>
      </Button>

      <Modal
        isOpen={isOpen}
        onOpenChange={toggleModal}
        placement="top-center"
        hideCloseButton
        classNames={{
          body: 'p-0',
          backdrop: '',
          base: '',
          header: 'p-0',
          footer: '',
          closeButton: '',
        }}
      >
        <ModalContent>
          <ModalHeader className="flex flex-col border-b-2">
            <Input
              autoFocus
              value={searchValue}
              onChange={handleInputChange}
              onKeyUp={handleKeyUp}
              inputContainerClassName="border-none"
              placeholder="Search"
              size="xl"
              variant="underlined"
              fullWidth
              startContent={<IconSearch className="mr-2 text-gray-400" size={22} />}
              endContent={<Kbd>esc</Kbd>}
            />
          </ModalHeader>
          <ModalBody className="max-h-[300px] overflow-y-auto">{renderSearchResults}</ModalBody>
        </ModalContent>
      </Modal>
    </>
  );
};

export default SearchDialog;
