export const getTxnsHashesForAddressesQuery = () => {
  return `
    select distinct t.hash, b.num
    from transaction t
    inner join block b on b.hash = t."blockHash"
    inner join tx_in_expanded tie on t.hash = tie."txHash"
    inner join tx_out tout on t.hash = tout."txHash"
    where tout."scriptPublicKey" = ANY($1)
    order by b.num asc
    limit $2
    offset $3;
  `;
};

export const countTxnsHashesForAddressesQuery = () => {
  return `
    select count(*)
    from (
      select distinct t.hash, b.num
      from transaction t
      inner join block b on b.hash = t."blockHash"
      inner join tx_in_expanded tie on t.hash = tie."txHash"
      inner join tx_out tout on t.hash = tout."txHash"
      where tout."scriptPublicKey" = ANY($1)
      order by b.num asc
    ) temp
  `;
};
