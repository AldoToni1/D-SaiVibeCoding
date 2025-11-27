// src/components/PublicRoute.tsx
import { PublicMenu } from './PublicMenu';
import { LanguageProvider } from '../contexts/LanguageContext';
import { MenuProvider } from '../contexts/MenuContext';

export default function PublicRoute() {
  return (
    <LanguageProvider>
      <MenuProvider>
        <PublicMenu />
      </MenuProvider>
    </LanguageProvider>
  );
}