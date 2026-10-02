  const viewWidth = () => {
    const w = scrollerRef.current?.clientWidth ?? 0;
    return w > 0 ? w : window.innerWidth || 390;
  };