'use client';

import { useEffect, useState } from 'react';
import { Button } from '@/components/ui/Button';
import { useToast } from '@/components/ui/Toast';
import { dismissImport, importLocalData, SYNC_ERROR_EVENT, useAccount } from '@/services/user';
import styles from './SyncNotice.module.css';

/**
 * Avisos da sincronização com a conta:
 * - depois de entrar, oferece levar para a conta o que já estava salvo no navegador;
 * - avisa se os dados da conta não carregaram ou se uma gravação falhou.
 */
export function SyncNotice() {
  const { pendingImport, cloudFailed } = useAccount();
  const [importing, setImporting] = useState(false);
  const [hideFailure, setHideFailure] = useState(false);
  const toast = useToast(4000);
  const { show } = toast;

  useEffect(() => {
    const onError = () => show('Não deu para salvar na nuvem. Seus dados foram recarregados; tente de novo.');
    window.addEventListener(SYNC_ERROR_EVENT, onError);
    return () => window.removeEventListener(SYNC_ERROR_EVENT, onError);
  }, [show]);

  async function onImport() {
    setImporting(true);
    try {
      const n = await importLocalData();
      show(n === 1 ? '1 registro levado para a sua conta.' : `${n} registros levados para a sua conta.`);
    } catch {
      show('Não deu para importar agora. Tente de novo em instantes.');
    } finally {
      setImporting(false);
    }
  }

  return (
    <>
      {pendingImport > 0 && (
        <div className={styles.card} role="region" aria-label="Importar dados deste navegador">
          <p className={styles.text}>
            <strong>Você já tinha {pendingImport === 1 ? '1 registro' : `${pendingImport} registros`} neste navegador.</strong>{' '}
            Quer levar para a sua conta? Assim eles aparecem em qualquer aparelho.
          </p>
          <div className={styles.actions}>
            <Button variant="primary" size="sm" onClick={onImport} disabled={importing}>
              {importing ? 'Levando…' : 'Levar para a conta'}
            </Button>
            <Button variant="ghost" size="sm" onClick={dismissImport} disabled={importing}>
              Agora não
            </Button>
          </div>
        </div>
      )}

      {cloudFailed && !hideFailure && (
        <div className={styles.card} role="alert">
          <p className={styles.text}>
            <strong>Não conseguimos abrir seus dados da conta.</strong> Por enquanto, o que você registrar fica salvo neste
            navegador.
          </p>
          <div className={styles.actions}>
            <Button variant="ghost" size="sm" onClick={() => setHideFailure(true)}>
              Entendi
            </Button>
          </div>
        </div>
      )}

      {toast.node}
    </>
  );
}
