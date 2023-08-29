import React from 'react';
import styles from './ResultCard.module.css';
import { Props } from './types';

const ResultCard: Props = ({ title, value }) => {
  return (
    <div className={styles.card}>
      <div className={styles.title}>
        {title}
      </div>
      <div className={styles.value}>
        {value}
      </div>
    </div>
  );
};

export default ResultCard;
