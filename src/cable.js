import { createConsumer } from "@rails/actioncable";


const URL = '/cable';

const consumer = createConsumer(URL);

export default consumer;
