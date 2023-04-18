FROM public.ecr.aws/lambda/nodejs:18

COPY temp/package.json ${LAMBDA_TASK_ROOT}/
RUN npm install --omit=optional --omit=dev

COPY temp/src ${LAMBDA_TASK_ROOT}/src
COPY temp/php-files ${LAMBDA_TASK_ROOT}/php-files
COPY temp/index.php ${LAMBDA_TASK_ROOT}/wp/

COPY test.js ${LAMBDA_TASK_ROOT}/

CMD [ "test.handler" ]