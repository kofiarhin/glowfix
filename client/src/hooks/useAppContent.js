import { useQuery } from '@tanstack/react-query';
import content from '../data/brief.json';

const fetchContent = () => Promise.resolve(content);

const useAppContent = () => {
  return useQuery({ queryKey: ['brief'], queryFn: fetchContent, staleTime: Infinity });
};

export default useAppContent;
