'use client';

import FeedCard, { type FeedPost } from './FeedCard';

// Mock data lives here — easy to swap for an API call later
const MOCK_POSTS: FeedPost[] = [
  {
    id: '1',
    authorName: 'Aunt Sarah',
    authorAvatar: 'https://lh3.googleusercontent.com/aida-public/AB6AXuBDNRJV77P9FS3NucruDvtpkudtb0KoQVjCRNESAWJuazhcATtyQRltzqvBPBYZnGH96xrtwL_ZELWMy9eZVdmAL7mStHxND7fNsvYPmtPBT4UAoJImNuQqz2Zl0KydbbjFSXLUCDeTmgiY6xYTDbjmNozj1jKf_pQYvpKIJfSIWAEX1Z0NzpZVWfI59ovY2HelhlI3IV9haAyjRcWNHi42pbjnNj_6-DG7OlqHsCpflkxbn2uAmEK0qtHywC5dJG3AAEdjNLaXtgxZ',
    siloName: 'The Miller Family',
    timeAgo: '2 hours ago',
    imageUrl: 'https://lh3.googleusercontent.com/aida-public/AB6AXuDo8u7AGWvZAFLvHFeprh6O6Yi5pI3TZ4BXAgiebc6q3Hs28zdW_BSQIBWNNgOfOdwcjinjqAATkHy-gpMgMsptLns4e_GEQpjyo18gE5cceJRG2XQRTt2uzgKMmCpl7Vv_UWmR_HUNe64ODxPcsdN3iLmap6_A7f6LmwRdwzm7FskOx2-Vt-57lLfu0eaJTybBcX6d5HB_zfMhOq7my7c103CBufV4QoyWiNOKIvZsSjjkzOlqGaqrJqv_QFF28mcoJ_O938cM3xW-',
    imageAlt: 'Family dinner',
    caption: 'Finally caught the whole crew together for dinner! ❤️',
    likes: 12,
    comments: 4,
  },
  {
    id: '2',
    authorName: 'Mike',
    authorAvatar: 'https://lh3.googleusercontent.com/aida-public/AB6AXuBsE1Z-gtCwPAE_o64Rj2JB-8Y0r9tyU0aRg0LwrbTQ50d_i13V2VkQ02azkw2_lpCZ9ucDPb83qqOiWMBqHFv6JzAyUdR3vHfOk3L9dcpZNjswQhut4XlurUOTd0-EkUL9B3_CMSytBNL27RfU-KeIIqd-duy8mvx1QaXoE6btcUOonixnNaaQkjwz9duSu_WfienQ8Z8V5uua3XCjfecV6WKxn7CIw94xTDNTQUyg3foGux0ZK_coMEOU-B0fGoW3OnHRzjdNT2mr',
    siloName: 'College Bros',
    timeAgo: '5 hours ago',
    imageUrl: 'https://lh3.googleusercontent.com/aida-public/AB6AXuDNanrQO4kqMJulZAREkmen_HvwX_9O2AobIhaIDDYOQe51Gp5dkvE1OOde6528_7uzuLCcvZjUvJe5hBK96LBQwpDIYvC0Mat5HQhrI1odW0dbu5V6Z9kqFQMKiiix7bi-nqxQ7IVIOczwtbokvQJEuszNbF5IHcbBO3MR6Ba4xFO28o0gZ3WI93k02xBM-okqS21w2854zHIOMQbDHoCZ11JrFD3rXpKF4mJnvmcSNyNAComiqPD2ckAJmGzXeR9l5Pi-ThIQFkHM',
    imageAlt: 'Mountain peak',
    caption: 'Peak views from this morning\'s trail! 🏔️',
    likes: 8,
    comments: 2,
  },
];

export default function FeedList() {
  return (
    <div className="flex flex-col gap-10">
      {MOCK_POSTS.map(post => (
        <FeedCard key={post.id} post={post} />
      ))}
    </div>
  );
}